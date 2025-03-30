// MemeGallery.js
import React from "react";
import ReactPaginate from "react-paginate";

const MemeGallery = ({ memeImage, memedata, handleMemeClick, handlePageClick, totalPages, currentPage }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <div className="row">
          <h1 className="create-meme-title">Create Your Own Meme</h1>
          <hr />
          <div className="col-lg-12 columns">
            {Array.isArray(memedata) &&
              memedata.map((memeItem, index) => (
                <a
                  href="/#"
                  key={index}
                  style={{
                    width: "150px",
                    height: "150px",
                    float: "left",
                    marginTop: "10px",
                    marginRight: "10px",
                  }}
                  onClick={() =>
                    handleMemeClick(
                      `https://apimeme.com/meme?meme=${memeItem.imageName || memeItem}&top=&bottom=`
                    )
                  }
                >
                  <div style={{ height: "100px" }}>
                    <img
                      style={{ display: "block", margin: "0 auto" }}
                      src={`https://apimeme.com/thumbnail?name=${memeItem.imageName || memeItem}`}
                      alt="No pic Found"
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    {(memeItem.displayName || memeItem).replace(/-/g, " ")}
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
      <br />
      {memedata.length > 0 && (
        // <ReactPaginate
        //   previousLabel={"<"}
        //   nextLabel={">"}
        //   breakLabel={"..."}
        //   breakClassName={"break-me"}
        //   pageCount={totalPages}
        //   marginPagesDisplayed={3} // First and last three pages
        //   pageRangeDisplayed={3} // Pages around the current page
        //   onPageChange={handlePageClick}
        //   containerClassName={"pagination"}
        //   activeClassName={"active"}
        // />
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
};

export default MemeGallery;
