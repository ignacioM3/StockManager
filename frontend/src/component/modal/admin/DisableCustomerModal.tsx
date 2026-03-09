import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCustomerApi } from "../../../api/admin/CustomerApi";
import { CiWarning } from "react-icons/ci";


export function DisableCustomerModal() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const queryParams = new URLSearchParams(location.search);
    const deleteCustomerId = queryParams.get('disableCustomer')!
    const show = deleteCustomerId ? true : false;

    const { mutate } = useMutation({
        mutationFn: deleteCustomerApi,
        retry: false,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({ queryKey: ['getAllCustomerEnabled'] })
            navigate(location.pathname, { replace: true })
        }
    })

    const handleSubmit = () => mutate(deleteCustomerId)

    return (
        <div
            className={`${show ? 'fixed' : 'hidden'} bg-[#4b4b4b72] h-screen left-0 bottom-0 right-0 `}
            onClick={() => navigate(location.pathname, { replace: true })}
        >
             <div className='w-full h-full flex items-center justify-center'>

           
            <div
                className="bg-white w-[340px] rounded-xl shadow-xl p-6"
                onClick={(e) => e.stopPropagation()}
               
            >
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 flex items-center justify-center
                      rounded-full bg-red-100 text-red-600 text-xl">
                        <CiWarning  className="text-3xl"/>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 text-center mb-2">
                    Deshabilitar este cliente?
                </h2>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Dejara de visualizar en clientes activos, pero se mantendra en el sistema.
                </p>

                <div className="flex gap-3">
                    <button
                    type="button"
                        onClick={() => navigate(location.pathname, { replace: true })}
                        className="w-full py-2 rounded-lg border border-gray-300
                   text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full py-2 rounded-lg bg-blue-500 text-white
                   hover:bg-blue-600 shadow-md transition cursor-pointer"
                    >
                        Deshabilitar
                    </button>
                </div>
            </div>
              </div>
        </div>
    );
}
