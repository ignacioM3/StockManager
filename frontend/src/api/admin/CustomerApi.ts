import { isAxiosError } from "axios";
import api from "../../lib/axios";
import { type Customer } from "../../types/Customer";

interface CustomerListResponse {
  customers: Customer[];
  total: number;
}

export async function getAllCustomerEnabled(page: number, limit?: number): Promise<CustomerListResponse> {
  try {
    const url = `/admin/customer/list?page=${page}&limit=${limit || 6}`;
    const { data } = await api.get(url);
    return data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log(error)
      throw new Error(error.response.data.error);
    }
    throw new Error("Unexpected error occurred");
  }
}

export async function deleteCustomerApi(customerId: string): Promise<string> {
  try {

    const url = `/admin/customer/delete/${customerId}`;
    const { data } = await api.post(url);

    return data;

  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log(error)
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function createCustomerApi(customerData: Omit<Customer, "id" | "isActive">): Promise<Customer> {
  try {
    const url = `/admin/customer/create`;
    const { data } = await api.post(url, customerData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log(error)
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function updateCustomerApi({customerId, customerData}: {customerId: string, customerData: Omit<Customer, "id" | "isActive">}): Promise<Customer> {
  try {
    const url = `/admin/customer/update/${customerId}`;
    const { data } = await api.put(url, customerData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log(error)
      throw new Error(error.response.data.error);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function getCustomerByIdApi(id: string): Promise<Customer> {
  const { data } = await api.get(`/admin/customer/${id}`)
  return data.customer
}