import axios from "axios";
import { appStore } from "@/store";

const methodType = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

const defaultHeader = {
  Accept: "application/json",
  "Content-Type": "application/json;charset=UTF-8",
};

const client = axios.create({
  timeout: 1000 * 20,
  headers: defaultHeader,
  // allowed to carry cookie
  withCredentials: true,
});

// requestList
const requestList = [];
// cancelList
const cancelToken = axios.CancelToken;
let sources = {};

/**
 * requestInterception
 */
client.interceptors.request.use(
  (config) => {
    // Treat the request address and parameters as a complete request
    const request = JSON.stringify(config.url) + JSON.stringify(config.data);
    config.cancelToken = new cancelToken((cancel) => {
      sources[request] = cancel;
    });

    if (requestList.includes(request)) {
      sources[request]("cancelDuplicateRequest");
    } else {
      // requestList.push(request);
      // The request starts, changing the loading state for the loading animation
    }
    const store = appStore();
    // Authorization token
    // eslint-disable-next-line no-constant-condition
    if (store.accessToken) {
      config.headers["Authorization"] = "Bearer " + store.accessToken;
    }
    let language = window.lang;
    if (language === "zh") {
      language = "zh_CN";
    }
    config.headers["lang"] = language;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//responseInterception
client.interceptors.response.use(
  (response) => {
    // Remove from the list of requests in the current request
    const request =
      JSON.stringify(response.config.url) +
      JSON.stringify(response.config.data);
    requestList.splice(
      requestList.findIndex((item) => item === request),
      1
    );

    // When the request list is empty, change the loading state
    if (requestList.length === 0) {
      //
    }

    // Unified handling of authority authentication error management
    if (response.data.code === 100401) {
      // Not logged in Clear the store to save user information and jump to the login page
    }
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      requestList.length = 0;
      // changeTheLoadingState
      throw new axios.Cancel("cancel request");
    } else {
      //failedToProcessNetworkRequest
    }
    return Promise.reject(error);
  }
);

const request = (api, method = methodType.GET, params = {}) => {
  const data = method === "GET" ? "params" : "data";
  return new Promise((resolve, reject) => {
    client({ url: api, method: method, [data]: params })
      .then((response) => {
        console.log("response", response);
        if (response.status === 401) {
          // notLoggedIn
          window.location.href = "/";
        }
        resolve(response.data);
      })
      .catch((error) => {
        console.log("reponse error", error);
        reject(error);
      });
  });
};

export { request, sources, methodType };
