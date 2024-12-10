import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Content from "../../pages/Content"

{/* ************************ dynamic imports ********************************** */
}
const Design = React.lazy(() => import(/* webpackChunkName: "Design" */"../../pages/Design"))
//const Content = React.lazy(() => import(/* webpackChunkName: "Content" */"../../pages/Content"))
const Launcher = React.lazy(() => import(/* webpackChunkName: "Launcher" */"../../pages/Launcher"))

const RouterContainer = () => {
    return <div
        className={`flex flex-col w-full min-h-[690px] justify-center px-8 py-6 rounded-xl bg-white border  border-light_border gap-6`}>
        <Routes>
            <Route path={"/design"} element={<React.Suspense fallback={<div/>}>
                <Design/>
            </React.Suspense>}/>

            <Route path={"/content"}
                   element={
                       <Content/>
                   }
            />
            <Route path={"/launcher"}
                   element={<React.Suspense fallback={<div/>}>
                       <Launcher/>
                   </React.Suspense>}
            />

            <Route path="/" element={<Navigate to={"/design"} replace/>}/>

        </Routes>
    </div>


};

export default RouterContainer;