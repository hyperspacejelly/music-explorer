import {BrowserRouter, Routes, Route} from "../node_modules/react-router-dom";
import App from './App';
import CreateAccountForm from './components/CreateAccountForm';
import './index.css';


function AppRouter(){
    return(<>
            <BrowserRouter>
                    <Routes>
                        <Route index path="/" element={<App />}/>
                        <Route path="/create-account" element={<CreateAccountForm />} />
                    </Routes>
            </BrowserRouter>
        </>
    );
}

export default AppRouter;