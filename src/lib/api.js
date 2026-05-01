const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://boost-funder.onrender.com";

function getAuthHeader() {
  const token = localStorage.getItem("boostfundr_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP error ${response.status}`;
    try {
      const err = await response.json();
      errorMsg = err.message || errorMsg;
    } catch {
      // response body wasn't JSON – use default message
    }
    throw new Error(errorMsg);
  }
  // 204 No Content — return null instead of trying to parse JSON
  if (response.status === 204) return null;
  return response.json();
}

const api = {
  async get(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  },

  async post(endpoint, body = {}, options = {}) {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        // Let the browser set Content-Type for FormData (includes boundary)
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...getAuthHeader(),
        // Allow caller to add extra headers but NOT override Content-Type for FormData
        ...(options.headers
          ? Object.fromEntries(
              Object.entries(options.headers).filter(
                ([k]) => !(isFormData && k.toLowerCase() === "content-type")
              )
            )
          : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async put(endpoint, body = {}, options = {}) {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...getAuthHeader(),
        ...(options.headers
          ? Object.fromEntries(
              Object.entries(options.headers).filter(
                ([k]) => !(isFormData && k.toLowerCase() === "content-type")
              )
            )
          : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },

  async del(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    });
    return handleResponse(response);
  },

  async patch(endpoint, body = {}, options = {}) {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...getAuthHeader(),
        ...(options.headers
          ? Object.fromEntries(
              Object.entries(options.headers).filter(
                ([k]) => !(isFormData && k.toLowerCase() === "content-type")
              )
            )
          : {}),
      },
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse(response);
  },
};

export default api;
