export default function Title({ icon, title, subtitle, children }) {
    return (
        <div className="flex items-center gap-2">
            <div className="rounded-lg border border-border bg-background-element w-8 h-8 p-2 flex items-center justify-center">
                {icon &&
                    <span className="text-brand" translate="no">
                        {icon}
                    </span>
                }
            </div>
            <div className="flex flex-col">
                <h1 className="text-xl font-bold text-text leading-tight whitespace-nowrap">
                    {title ? title : children}
                    {/* text-xl font-bold text-heading leading-tight text-content-1 whitespace-nowrap  */}
                </h1>
                {subtitle && (
                    <p className="text-xs  text-text-secondary hidden sm:block">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}