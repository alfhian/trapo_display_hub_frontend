import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import LiveTVDisplay from '../components/LiveTVDisplay';
// 🔌 Socket client
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
});
export default function DisplayScreenPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    // 📡 Fetch single screen
    const fetchScreen = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/screens/${id}`);
            if (!res.ok)
                throw new Error(`HTTP ${res.status}`);
            const result = await res.json();
            setData(result);
        }
        catch (error) {
            console.error('Error fetching screen data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    // 🧭 Lifecycle
    useEffect(() => {
        if (!id)
            return;
        fetchScreen();
        // Join room realtime
        socket.on('connect', () => {
            console.log('🟢 Connected socket for screen', id);
            socket.emit('join_screen', id);
        });
        socket.on('screen:update', ({ screen_id, payload }) => {
            if (screen_id === id) {
                console.log('📡 Update for this screen:', payload);
                setData(payload.is_active ? payload : makeEmptyCard(id));
            }
        });
        // ✅ AUTO FULLSCREEN
        const goFullscreen = async () => {
            try {
                const elem = document.documentElement;
                if (elem.requestFullscreen)
                    await elem.requestFullscreen();
                else if (elem.webkitRequestFullscreen)
                    elem.webkitRequestFullscreen();
                else if (elem.msRequestFullscreen)
                    elem.msRequestFullscreen();
            }
            catch (err) {
                console.warn('⚠️ Fullscreen not allowed:', err);
            }
        };
        goFullscreen();
        return () => {
            socket.off('screen:update');
        };
    }, [id]);
    // Loading
    if (loading) {
        return (_jsx("div", { className: "w-screen h-screen bg-black flex items-center justify-center text-white text-2xl", children: "Loading..." }));
    }
    // 🧩 Pastikan card tetap ada walau kosong
    const displayData = data && data.customer_name
        ? data
        : makeEmptyCard(id || '00000000-0000-0000-0000-000000000000');
    return (_jsx("div", { className: "fixed inset-0 bg-black overflow-hidden", children: _jsx(LiveTVDisplay, { data: {
                customer_name: displayData.customer_name || '',
                brand: displayData.brand || '',
                type: displayData.type || '',
                license_plate: displayData.license_plate || '',
                year: displayData.year || '',
                service: displayData.service || '',
                estimated_time: displayData.estimated_time || '',
                status: displayData.is_active ? 'Active' : 'Inactive',
            }, index: getScreenNumber(id), onRemove: () => { }, isTVOutput: true }) }));
}
/* 🧱 Fungsi bantu — buat “card kosong” dengan tampilan tetap */
function makeEmptyCard(screen_id) {
    return {
        id: screen_id,
        screen_id,
        customer_name: '',
        brand: '–',
        type: '',
        license_plate: '–',
        year: '',
        service: '–',
        estimated_time: '',
        is_active: false,
    };
}
/* 🔹 Urutan slot */
function getScreenNumber(screenId) {
    const screenOrder = [
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004',
    ];
    const index = screenOrder.findIndex((id) => id === screenId);
    return index !== -1 ? index : 0;
}
