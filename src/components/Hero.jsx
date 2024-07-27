import { funnel } from '../assets';

const Hero = () => {
  return (
    <header className='w-full py-4 flex flex-col justify-center items-center'>
        <nav className='w-full flex items-end justify-between'>
            <div className='flex items-end space-x-2'>
                <img 
                src={funnel} 
                alt="logo" 
                className='object-contain'
                width={35}
                height={35}
                />
                <p className='text-3xl font-black font-inter text-green-700'>
                    Quick Digest
                </p>
            </div>
            
            <button 
                type='button'
                onClick={()=> window.open('https://www.google.com')}
                className='black_btn'
            >
                GitHub
            </button>
        </nav>
        <h1 className='head_text'>Transforming Articles into 
            <br />
        <span className='green_gradient'> Clear, Concise Summaries</span>
        </h1>
        <h2 className='desc'>Transform lengthy articles into concise summaries, getting the key points without the extra fluff and streamlines your reading and keeps you informed with minimal effort.</h2>
    </header>   
  )
}

export default Hero