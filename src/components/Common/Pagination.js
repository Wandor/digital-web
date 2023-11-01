/* eslint-disable no-console */
import React from 'react';
import Paginator from 'react-hooks-paginator';

function CustomPagination() {
  return (
    <div className="pro-pagination-style text-center mt-30 pt-10">
      <Paginator
        totalRecords={9}
        pageLimit={15}
        pageNeighbours={2}
        setOffset={(offset) => console.log(offset)}
        currentPage={1}
        setCurrentPage={(currentPage) => console.log(currentPage)}
        pageContainerClass="mb-0 mt-0"
        pagePrevText="«"
        pageNextText="»"
      />
    </div>
  );
}

CustomPagination.defaultProps = {
  message: 'Loading...',
};

export default CustomPagination;
