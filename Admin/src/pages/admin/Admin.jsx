import AddProduct from '../../components/addProduct/AddProduct'
import ListProduct from '../../components/listProduct/ListProduct'
import Sidebar from '../../components/sidebar/Sidebar'
import './admin.css'
import { Routes,Route } from 'react-router-dom'
const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
        <Route path='/addProduct' element={<AddProduct/>}></Route>
        <Route path='/listProduct' element={<ListProduct/>}></Route>
      </Routes>
    </div>
  )
}

export default Admin