import React from 'react';

const Input = (props) => {
  return (
    <div>
      <label title={props.title}/>
      <input
      id={props.id}
      type={props.type}
      placeholder={props.placeholder}
      title={props.title}
      value={props.value}
      onChange={(e)=>props.onChange(props.id,e.target.value,e.target.files)}  
      />
    </div>
  )
}
export default Input;
