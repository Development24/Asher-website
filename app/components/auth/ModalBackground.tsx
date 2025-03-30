export function ModalBackground() {
  return (
    <div 
      className="fixed inset-0 z-40"
      style={{
        backgroundImage: 'url(https://cdn.pixabay.com/photo/2022/06/02/11/33/dubai-7237746_640.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        opacity: '0.7'
      }}
    />
  )
}

