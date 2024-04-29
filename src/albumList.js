import { useEffect, useState } from "react";
const AlbumList = () => {
  const API_BASE = "http://demo.subsonic.org/rest/";
  const username = "guest";
  const password = "guest";
  const version = "1.12.0";
  const [albums, setAlbums] = useState([])
  const [activeAlbum, setActiveAlbum] = useState(0)
  const [activeAlbumDetails, setActiveAlbumDetails] = useState()
  useEffect(() => {
    if (albums.length === 0) {
      fetch(
        `${API_BASE}/getAlbumList2?u=${username}&p=${username}&v=${version}&type=random&c=test&f=json`
      ).then(r => r.json()).then((response) => {
        setAlbums(response['subsonic-response'].albumList2.album)
        getAlbumDetails(response['subsonic-response'].albumList2.album[0].artistId, 0)
      });
    }
  }, []);

  const getAlbumDetails = (id, index) => {
    fetch(
      `${API_BASE}/getAlbum?u=${username}&p=${username}&v=${version}&type=random&c=test&f=json&id=${id}`
    ).then(r => r.json()).then((response) => {
      const container = document.getElementsByClassName('image-carousel')[0]
      container?.scrollTo({
        behavior: "smooth",
        left: 300 * index, // width of image * index
      })
      // container.style.transform = `translateX(-${index *100}%)`;
      setActiveAlbumDetails(response['subsonic-response'].album)
    })
  }

  const onLeftButtonClick = () => {
    const index = activeAlbum - 1 > 0 ? activeAlbum - 1 : albums.length - 1
    setActiveAlbum(activeAlbum)
    getAlbumDetails(albums[activeAlbum].artistId, index)
  }

  const onRightButtonClick = () => {
    const index = activeAlbum + 1 > albums.length - 1 ? 0 : activeAlbum + 1
    setActiveAlbum(index)
    getAlbumDetails(albums[activeAlbum].artistId, index)

  }

  return (
    <div>
      <div className="container">
      <button className="action" onClick={onLeftButtonClick}>&lArr;</button>
      <div className="main-container">
      <div className="image-carousel">
      {albums.map((album, index) => {
        return (  
          <img id={`album-${album.artistId}`} key={index} className={activeAlbum === index ? 'item active-image' : 'item'}  src={`${API_BASE}/getCoverArt?u=${username}&p=${username}&v=${version}&type=random&c=test&f=json&id=${album.artistId}`} alt={album.artist} />
        )
      })}
      </div>
      </div>
      <button className="action" onClick={onRightButtonClick}>&rArr;</button>
      </div>
      {activeAlbumDetails && 
      <div className="table-container">
        <h2>{activeAlbumDetails.name}</h2>
      <table>
        <tr>
        <th>
          Id#
        </th>
        <th>
          Track
        </th>
        </tr>
        {activeAlbumDetails.song.map((song) => {
          return (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.title}</td>
            </tr>
          )
        })}
      </table>
      </div>}
    </div>
  )
};

export default AlbumList;
