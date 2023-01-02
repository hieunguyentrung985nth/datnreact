import { useEffect } from 'react';

const addScript = (url) => {
  // useEffect(() => {
   
  // }, [url]);
  // console.log(document.querySelector('script[src="' + url + '"]'));
  
  const script = document.createElement('script');
  script.src = url;
  script.defer = true;
  if (document.querySelector('script[src="' + url + '"]')) {
    // document.body.remove(document.querySelector('script[src="' + url + '"]'));
    document.body.removeChild(document.querySelector('script[src="' + url + '"]'))
  }
  document.body.appendChild(script);
};

export default addScript;