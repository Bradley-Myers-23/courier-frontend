import apiClient from "./services";

export default {
  getRates() {
    return apiClient.get("rates");
  },
  getRate(id) {
    return apiClient.get("rates/" + id);
  },
  addRate(rate) {
    return apiClient.post("rates", rate);
  },
  updateRate(rateId, rate) {
    return apiClient.put("rates/" + rateId, rate);
  },
  deleteRate(rateId) {
    return apiClient.delete("rates/" + rateId);
  },
};