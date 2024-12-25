import React from 'react';
import PropTypes from 'prop-types';

export default function BackToPrev({ href, children }) {
    return (
        <a 
            href={href} 
            className="relative group w-fit flex pl-7 pr-3 py-2 flex-nowrap rounded-xl border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                className="absolute top-1/2 left-2 -translate-y-1/2 size-4 stroke-2 fill-none stroke-current"
            >
                <line 
                    x1="5" 
                    y1="12" 
                    x2="19" 
                    y2="12" 
                    className="translate-x-2 group-hover:translate-x-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
                />
                <polyline 
                    points="12 5 5 12 12 19" 
                    className="translate-x-1 group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
                />
            </svg>
            <div className="text-sm">
                {children}
            </div>
        </a>
    );
}

BackToPrev.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
