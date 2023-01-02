import Home from "../../components/Home/Home";
import NotFound from "../../components/NotFound/NotFound";


const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path:'*',
    component: NotFound
  }
]

export default routes;