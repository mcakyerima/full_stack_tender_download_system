import { ReactNode } from 'react';

export default function MarginWidthWrapper({
    children
}: {
    children: ReactNode
}) {
    return (
        <div className="md:ml-[200px]">
            {children}
        </div>
    )
}