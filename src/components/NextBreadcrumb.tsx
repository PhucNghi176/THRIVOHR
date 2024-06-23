'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type TBreadCrumbProps = {
    separator: ReactNode;
    containerClasses?: string;
    listClasses?: string;
    activeClasses?: string;
    capitalizeLinks?: boolean;
};

const NextBreadcrumb = ({ separator, containerClasses, listClasses, activeClasses, capitalizeLinks }: TBreadCrumbProps) => {
    const paths = usePathname();
    let pathNames = paths.split('/').filter(path => path);

    // Remove the first "home" from the breadcrumb if it exists
    if (pathNames[0] === 'home') {
        pathNames = pathNames.slice(1);
    }

    return (
        <div>
            <ul className={containerClasses}>
                {pathNames.length > 0 && (
                    <>
                        {
                            pathNames.map((link, index) => {
                                let href = `/${pathNames.slice(0, index + 1).join('/')}`;
                                let itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses;
                                let itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link;
                                return (
                                    <React.Fragment key={index}>
                                        <li className={itemClasses}>
                                            <Link href={href}>{itemLink}</Link>
                                        </li>
                                        {pathNames.length !== index + 1 && separator}
                                    </React.Fragment>
                                );
                            })
                        }
                    </>
                )}
            </ul>
        </div>
    );
};

export default NextBreadcrumb;
