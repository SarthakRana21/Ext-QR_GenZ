const saveImgBtn = document.querySelector('.save-image')
const copyBtn = document.querySelector('.copy-btn')
const input = document.querySelector('.input')
const submitBtn = document.querySelector('.submitBtn')
const qrImg = document.querySelector('.qr-image')
const alert = document.querySelector('.alert')

// extension onload chrome query
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    const tabUrl = tabs[0].url
    qrGenerator(tabUrl)
    
})


saveImgBtn.addEventListener('click', ()=>{
  onClickColor('#A53AF9','#fff','#fff','#A53AF9', saveImgBtn)
  saveImgBtn.innerHTML = `Saving Image...`
  downloadQr()
})

copyBtn.addEventListener('click', ()=>{
  onClickColor('#22C55E', '#fff', '#fff','#22C55E', copyBtn)
  copyBtn.innerHTML = `Copying to Clipboard...`
  copyImgToClipboard()
})

submitBtn.addEventListener('click',(e)=>{
    e.preventDefault()
    regenerateQr()
})


// generate the qr code throught API
async function qrGenerator(tabUrl){
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?data=${tabUrl}&size=150x150`
  qrImg.src = qrApi
}

// download the Qr generated
async function downloadQr(){
  const imgUrl = qrImg.getAttribute('src')
  try {
    const data = await fetch(imgUrl)
    const blob = await data.blob()

    const tempUrl = URL.createObjectURL(blob)
    let aTag = document.createElement('a')
    aTag.href = tempUrl

    let date = new Date
    let date1 = date.toLocaleDateString()

    aTag.download = `qrCode_${date1}`
    document.body.appendChild(aTag)
    aTag.click()
    aTag.remove()

    setTimeout(()=>{
      saveImgBtn.innerHTML = `Save Image`
    },300)
  } catch (err) {
    console.log(err.name, err.message);
  }

}

// copy the qr Image to clipbaord
async function copyImgToClipboard() {
  const imgUrl = qrImg.getAttribute('src')
    try {
      const data = await fetch(imgUrl);
      const blob = await data.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setTimeout(()=>{
        copyBtn.innerHTML = `Copy to Clipboard`
      }, 300)
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

// Generating new Qr from user Input
async function regenerateQr(){
  try {
    const newUrl = await input.value
    if(!newUrl.startsWith('https:',0)){
      alert.style.visibility = 'visible'
      setTimeout(()=>{
        alert.style.visibility = 'hidden'
      },4000)
    }else{
      alert.style.visibility = 'hidden'
      qrGenerator(newUrl)
      
  }
  } catch (err) {
    console.log(err.name, err.message)
  }
  
}

// on click animations, transitions
function onClickColor(color1, bgColor1, color2, bgColor2, elem){
  elem.style.color = color1
  elem.style.background = bgColor1
  setTimeout(() => {
    elem.style.color = color2
    elem.style.background = bgColor2
  }, 300);
}
