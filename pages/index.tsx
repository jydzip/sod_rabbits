import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [SceneApp, setSceneApp] = useState<any>(null);

  useEffect(() => {
    import('../src/AppScene').then(module => {
      setSceneApp(() => module.default);
    });
  }, []);

  return (
    <>
      {SceneApp && (
        <SceneApp />
      )}
    </>
  )
}
export default IndexPage