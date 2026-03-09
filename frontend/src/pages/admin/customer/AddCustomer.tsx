import { useNavigate } from "react-router-dom";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageContent } from "../../../component/styles/PageContent";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { AppRoutes } from "../../../routes";
import { useForm } from "react-hook-form";
import type { CreateCustomerData } from "../../../types/Customer";
import ErrorLabel from "../../../component/styles/ErrorLabel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomerApi } from "../../../api/admin/CustomerApi";
import { toast } from "react-toastify";

export function AddCustomer() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const initialValues = {
        name: "",
        location: "",
        email: ""
    }

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: initialValues
    })

    const { mutate } = useMutation({
        mutationFn: createCustomerApi,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            toast.success("Cliente creado exitosamente")
            queryClient.invalidateQueries({ queryKey: ['getAllCustomerEnabled'] })
            reset()
        }
    })

    const handleCreateCustomer = (data: CreateCustomerData) => {
        mutate(data)
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Crear Cliente</PageTitle>
            </PageHeader>
            <PageContent>
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300 max-w-[800px] mx-auto w-full">
                    <form className="space-y-6" onSubmit={handleSubmit(handleCreateCustomer)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-md font-medium text-[#5C4630] mb-2 flex items-center gap-1">
                                    Nombre del cliente {errors.name && <ErrorLabel className="text-[12px]">{errors.name.message}</ErrorLabel>}
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: "El nombre es requerido" })}
                                    className={`w-full placeholder-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#656766] focus:border-transparent  "}`}
                                    placeholder="Ej: Juan Perez"
                                />
                            </div>

                            <div>
                                <label className="text-md font-medium text-[#5C4630] mb-2 flex items-center gap-1">
                                    Ubiación {errors.location && <ErrorLabel className="text-[12px]">{errors.location.message}</ErrorLabel>}
                                </label>
                                <input
                                    {...register("location", { required: "La ubicación es requerida" })}
                                    type="text"
                                    id="location"
                                    placeholder="Ej: Argentina - Buenos aires"
                                    className={`w-full placeholder-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#656766]  focus:border-transparent "}`}
                                />
                            </div>
                            <div>
                                <label className="text-md font-medium text-[#5C4630] mb-2 flex items-center gap-1">
                                    Email {errors.email && <ErrorLabel className="text-[12px]">{errors.email.message}</ErrorLabel>}
                                </label>
                                <input
                                    {...register("email", { required: "El email es requerido" })}
                                    id="email"
                                    type="email"
                                    className={`w-full placeholder-gray-400 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#656766]  focus:border-transparent  "}`}
                                    placeholder="Ej: Cliente@gmail.com"
                                />
                            </div>
                        </div>



                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-300">
                            <button
                                type="button"
                                onClick={() => navigate(AppRoutes.listCustomers.route())}
                                className="px-6 cursor-pointer py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-6 cursor-pointer py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-medium"
                            >
                                Crear Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </PageContent>
        </PageContainer>
    )
}
