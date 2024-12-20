export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url: string, body: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    return await response.json();
  } catch (error) {
    return { error: "Network error" };
  }
};
