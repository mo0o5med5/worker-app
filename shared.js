const LS_REQUESTS = "requests_v1";

function getRequests(){
  return JSON.parse(localStorage.getItem(LS_REQUESTS) || "[]");
}

function saveRequests(list){
  localStorage.setItem(LS_REQUESTS, JSON.stringify(list));
}

function addRequest(req){
  const list = getRequests();
  list.unshift(req);
  saveRequests(list);
}

function updateRequest(id, patch){
  const list = getRequests().map(r => r.id === id ? { ...r, ...patch } : r);
  saveRequests(list);
}
