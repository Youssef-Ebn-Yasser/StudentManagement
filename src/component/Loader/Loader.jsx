import React, { useState } from 'react'
import { ColorRing } from 'react-loader-spinner'

function Loader() {

    return <>
    <ColorRing
    visible={true}
    height="20"
    width="20"
    ariaLabel="color-ring-loading"
    wrapperStyle={{}}
    wrapperClass="color-ring-wrapper"
    colors={['#393E46', '#1E201E', '#040D12', '#EEEEEE', '#423F3E']}/>
  </>
}

export default Loader
