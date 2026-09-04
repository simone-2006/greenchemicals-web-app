export default function NavbarButton({ children, isActive }) {
    const activeClass = "bg-brand hover:bg-brand-dark text-text-inverted";
    const inactiveClass = "bg-transparent hover:bg-background-secondary text-text";
    return (
        <button className={`transition-all rounded-md px-1.5 py-1 cursor-pointer ${isActive? activeClass : inactiveClass}`}>
            {children}
        </button>
    );
}