import React from 'react';
import { Select } from 'antd';
import './commentPermission.css';


// const onSearch = (value: string) => {
//   console.log('search:', value);
// };
interface CommentPermissionProps {
  permissionValue?: string;
  getPermission: (permission: string) => void;

}

// Filter `option.label` match the user type `input`
const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const PermissionSelect: React.FC<CommentPermissionProps> = ({getPermission, permissionValue}) => 
  {const onChange = (value: string) => {
    getPermission(value);
  }
  return ( <Select
    className="permission-select"
    showSearch
    placeholder="Who can comment?"
    optionFilterProp="children"
    onChange={onChange}
    // onSearch={onSearch}
    filterOption={filterOption}
    value={permissionValue}
    defaultValue="ANYONE"
    options={[
      {
        value: 'ANYONE',
        label: 'Anyone can comment',
      },
      {
        value: 'NO_ONE',
        label: 'No one can comment',
      },
    
    ]}
  />
)}

export default PermissionSelect;