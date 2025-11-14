
"use client"

const GlobalError = ({ error }: { error: Error }) => {

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
    </div>
  )
}

export default GlobalError
