export const CustomField = ({ fieldConfig, field }) => {
  const CustomComponent = fieldConfig.component;
  return (
    <CustomComponent
      {...fieldConfig.props}
      onImageChange={(image) => field.onChange(image)}
    />
  );
};
