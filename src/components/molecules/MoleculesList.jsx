import React from 'react';
import { List } from 'antd';
import { Button as ButtonShacdn } from "@components/ui/button";

const MoleculesList = ({
  data,
  filtersComponent,
  onActionClick,
  renderItemExtra,
  renderItemMeta,
  actions,
  pageSize = 5, // Nuevo prop con valor por defecto
}) => {
  return (
    <>
      <div className='bg-white pt-5 pb-5 px-5 rounded-2xl md:col-span-2'>
        {filtersComponent && (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {filtersComponent}
          </div>
        )}
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => console.log(page),
            pageSize: pageSize, // Usar el prop pageSize
          }}
          dataSource={data}
          renderItem={(item) => {
            // Soportar actions como función o array
            const itemActions = typeof actions === "function" ? actions(item) : actions || [];
            return (
              <List.Item
                key={item.id}
                extra={renderItemExtra(item)}
                className="bg-white rounded-lg p-4 mb-4"
                actions={itemActions.map((action, index) => (
                  <ButtonShacdn
                    key={index}
                    className={action.className}
                    onClick={() => onActionClick(action.type, item)}
                  >
                    {action.icon} {action.label}
                  </ButtonShacdn>
                ))}
              >
                <List.Item.Meta
                  avatar={renderItemMeta(item).avatar}
                  title={renderItemMeta(item).title}
                  description={renderItemMeta(item).description}
                />
              </List.Item>
            );
          }}
        />
      </div>
    </>
  );
};

export default MoleculesList;
