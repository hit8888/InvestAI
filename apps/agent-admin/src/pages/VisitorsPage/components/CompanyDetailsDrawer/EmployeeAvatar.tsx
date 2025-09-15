const EmployeeAvatar = ({ avatar, name }: { avatar?: string; name: string }) => {
  return avatar ? (
    <img src={avatar} alt={`${name} avatar`} className="h-full w-full rounded-full object-cover" />
  ) : (
    <div className="border-white/24 flex h-full w-full items-center justify-center rounded-full border-2 bg-purple-100 text-purple-600">
      <span className="text-sm font-semibold">
        {name
          .split(' ')
          .map((n) => n.charAt(0))
          .join('')}
      </span>
    </div>
  );
};

export default EmployeeAvatar;
