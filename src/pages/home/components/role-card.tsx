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
      className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-3xl border border-[#a9df86] bg-[#ebffde] px-5 pt-4 pb-5 text-left shadow-[0_4px_4px_rgba(0,0,0,0.03)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#575757] active:bg-[#ebffde]/75"
    >
      <span className="rounded-full bg-white px-2 py-1 text-[12px] font-medium text-[#575757]">
        {label}
      </span>
      <span className="flex w-full items-center gap-3">
        <span className="grid size-16 shrink-0 place-items-center rounded-full border border-[#a9df86] bg-white">
          <img src={icon} alt="" width={40} height={40} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[24px] font-semibold">{title}</span>
          <span className="text-base/[1.3] font-medium text-[#767676]">{description}</span>
        </span>
      </span>
    </button>
  );
};

export default RoleCard;
