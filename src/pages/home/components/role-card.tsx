interface RoleCardProps {
  label: string;
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

const RoleCard = ({ label, title, description, icon, onClick }: RoleCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-3xl border border-primary-green-500 bg-primary-green-50 pt-4 pr-[18px] pb-5 pl-5 text-left shadow-[0_4px_4px_rgba(0,0,0,0.03)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:bg-primary-green-50/75"
    >
      <span className="rounded-full bg-white px-2 py-1 text-body-medium-s text-gray-600">
        {label}
      </span>
      <span className="flex w-full items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center rounded-full border border-primary-green-500 bg-white">
          <img src={icon} alt="" width={40} height={40} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-title-semibold-l">{title}</span>
          <span className="text-body-medium-l text-gray-500">{description}</span>
        </span>
      </span>
    </button>
  );
};

export default RoleCard;
