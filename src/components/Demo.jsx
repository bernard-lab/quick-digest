import {useState, useEffect, useRef } from 'react';
import { copy, linkIcon, loader, tick, erase} from '../assets'
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {  
  const searchUrlInput = useRef(); 
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleClear = () => {
    searchUrlInput.current.value = "";
  }
  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full'>
        <form 
          className='relative flex w-full gap-2'
          onSubmit={handleSubmit}
        >
          <img 
            src={linkIcon} 
            alt='link icon'
            className='absolute left-0 mt-[0.7rem] ml-3 w-5 opacity-40'
          />        

          <input 
            type="url"
            placeholder='Enter a URL' 
            value={article.url}
            onChange={(e) => setArticle({...article, url: e.target.value})}
            onKeyDown={handleKeyDown}
            ref={searchUrlInput}
            required
            className='url_input peer' // peer button 
          />
            
            <div className='absolute mt-[10px] right-0 mr-2 flex justify-center items-center'>             
                <button
                  type='submit'
                  className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700' // peer activated when input is active            
                >
                  &#10550;
                </button>
                
                <div className="group relative w-full flex justify-center">
                
                    <img 
                      src={erase} 
                      alt='erase icon'
                      className='w-5 hover:opacity-80 hover:cursor-pointer group'
                      onClick={handleClear}
                    />                 
                 
                  <span className="absolute text-nowrap -top-7 -right-3 scale-0 rounded text-[12px] text-cyan-700 group-hover:scale-100 transition-all">Clear URL!</span>
              </div>
            </div>
        </form>

        {/* Browser URL History */}
        <div className='flex flex-col gap-1 maxh-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div 
              key={`link=${index}`}
              onClick={()=> setArticle(item)}
              className='link_card'
            >
                <div 
                  className="copy_btn" 
                  onClick={() => handleCopy(item.url)}>
                  <img 
                    src={copied === item.url ? tick : copy}
                    alt='copy-icon'
                    className='w-[40%] h-[40%] object-contain'
                  />
                </div>
                  <p className='felx-1 font-satoshi text-blue-700 text-sm truncate'>{item.url}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Display result */}
      <div className="my-10 max-w-full flex justify-center items-center">
          {isFetching ? (
            <img 
            src={loader} 
            alt="loader"
            className='w-20 h-20 object-contain'
            />
          ) :  error? (
            <p className='font-bod text-red-500 font-inter text-center'>
              Unexpected Error.... 
              <span className='font-satoshi font-normal text-black'>
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && 
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-700 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='text-gray-700 text-sm font-inter font-medium leading-6'>
                  {article.summary}
                </p>
              </div>
            </div>
          )          
        }
      </div> 
    </section>
  )
}

export default Demo