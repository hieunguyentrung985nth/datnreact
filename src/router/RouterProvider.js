import React from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import routes from "./Routes";

function RouterProvider(){
    return(
        <Router>
            <Routes>
                {
                    routes.map(route=>(
                        <Route key={route.component} path={route.path}
                         element={<route.component/>} />
                    ))
                }
            </Routes>
        </Router>
    )
}
export default RouterProvider;