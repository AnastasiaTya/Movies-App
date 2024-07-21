import { Tabs } from 'antd'

import './TabsHeader.css'

function TabsHeader({ toggleTabs }) {
  const items = [
    {
      key: '1',
      label: 'Search',
    },
    {
      key: '2',
      label: 'Rated',
    },
  ]
  return (
    <div className="tab-wrapper">
      <Tabs defaultActiveKey="1" items={items} centered size="large" onChange={toggleTabs} />
    </div>
  )
}

export default TabsHeader
