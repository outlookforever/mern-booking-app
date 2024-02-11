import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelType} from '../../backend/src/shared/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    // Cookies //Говорит о том. что мы будем отправлять Cookies!!!!
    // Отправляет и устанавливает любые фалы  Cookies
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(formData)
  })

  const responseBody = await response.json()

  if(!response.ok) {
    throw new Error(responseBody.message);
  }
} 

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    // Cookies
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(formData)
  })

  const body = await response.json()

  if(!response.ok) {
    throw new Error(body.message);
  }

  return body
}

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validation-token`, {
    // Cookies
    credentials: "include",
  })
  if(!response.ok) {
    throw new Error('Token invalid');
  }

  return response.json()
}

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: "include",
  })

  if(!response.ok) {
    throw new Error('Error during sign out');
  }
}


export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async():Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
}

export const fetchMyHotelById = async (hotelId: string):Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
}

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
    method: "PUT",
    credentials: "include",
    body: hotelFormData,
  })

  if (!response.ok) {
    throw new Error("Failed to update hotel");
  }

  return response.json();
}