import React from 'react';

const SidebarHeaderTitle = ({title, click}) => {
    return <div
        className={`bg-primary_extra_light border border-t-0 border-r-0 border-l-0 rounded-t-xl border-b-card_border px-2.5 2xl:px-4 py-3 flex items-center gap-x-2`}>
        <i className={`text-dark wlr wlrf-arrow_left cursor-pointer text-md 2xl:text-lg font-medium `}
           onClick={click}
        />
        <p className={`text-dark  text-sm 2xl:text-md  font-medium tracking-wide  `}>
            {title}
        </p>
    </div>
};

export default SidebarHeaderTitle;