import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <img src={imgSrc} alt="No notes" className="w-60 opacity-90" />

        <p className="mt-5 max-w-md text-sm font-medium text-slate-600 leading-7">
          {message}
        </p>
    </div>
  )
}

export default EmptyCard