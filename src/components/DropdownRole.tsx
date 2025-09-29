import Select from 'react-select';

const options = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

type RoleSelectProps = {
  role: string | null;
  setRole: (role: string | null) => void;
};

export default function RoleSelect({ role, setRole }: RoleSelectProps) {
  return (
    <Select
      options={options}
      value={options.find(opt => opt.value === role)}
      onChange={(opt) => setRole(opt?.value ?? null)}
      placeholder="Pilih Role"
      className='w-full py-1 px-2 bg-white rounded-full'
      isClearable
    />
  );
}
