async function o(e){return fetch("/api/save-job",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e,action:"save job"})})}export{o as saveJob};
