// script.js

async function startScan() {
    const placeholder = document.getElementById("scanPlaceholder");
    placeholder.innerHTML = "";
  
    // countdown badge
    const countdown = document.createElement("div");
    countdown.id = "countdown";
    countdown.style.cssText = "position:absolute;top:10px;right:10px;padding:0.5rem;background:rgba(0,0,0,0.6);color:#fff;border-radius:4px;";
    placeholder.appendChild(countdown);
  
    // video & canvas
    const video = document.createElement("video");
    video.autoplay = true; video.muted = true;
    video.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;mix-blend-screen;";
    const canvas = document.createElement("canvas");
    canvas.id = "silhouetteCanvas";
    canvas.style.cssText = "position:absolute;inset:0;";
    placeholder.append(video, canvas);
  
    // camera
    const stream = await navigator.mediaDevices.getUserMedia({ video:true });
    video.srcObject = stream;
  
    // draw loop
    const ctx = canvas.getContext("2d");
    canvas.width = placeholder.clientWidth;
    canvas.height = placeholder.clientHeight;
    let t = 30;
    countdown.textContent = `${t}s`;
    const timer = setInterval(() => {
      t--; countdown.textContent = `${t}s`;
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      if (t <= 0) {
        clearInterval(timer);
        stream.getTracks().forEach(tr=>tr.stop());
        silhouette(ctx,canvas);
        showCompleteModal(ctx,canvas);
      }
    }, 1000);
  
    function silhouette(ctx,canvas) {
      const img = ctx.getImageData(0,0,canvas.width,canvas.height);
      for (let i=0; i<img.data.length; i+=4) {
        const avg = (img.data[i]+img.data[i+1]+img.data[i+2])/3;
        const v = avg>128?255:0;
        img.data[i]=img.data[i+1]=img.data[i+2]=v;
      }
      ctx.putImageData(img,0,0);
    }
  }
  
  function showCompleteModal(ctx, canvas) {
    const modal = document.getElementById("completeModal");
    modal.style.display = "flex";
  
    // Delete path
    document.getElementById("deleteVideos").onclick = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      alert("✅ Your videos have been permanently deleted.");
      goToReport();
    };
  
    // Keep path
    document.getElementById("keepVideos").onclick = () => {
      alert("✅ Your videos will remain securely stored.");
      goToReport();
    };
  }
  
  function goToReport() {
    // small delay so user sees the alert
    setTimeout(() => location.href = "report.html", 300);
  }
  
  // auto-start on scan page
  window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("scanPlaceholder")) startScan();
  });
  