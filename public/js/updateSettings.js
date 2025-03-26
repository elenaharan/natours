/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const updateSettings = async (name, email) => {
  try {
    const res = await axios ({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
      withCredentials: true
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Settings updated successfully.');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }

}