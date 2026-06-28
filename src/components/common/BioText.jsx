const BioText = ({ bio, className = "", fallback = "No bio available" }) => {
  if (!bio?.trim()) {
    return <p className={className}>{fallback}</p>;
  }

  return (
    <p className={`whitespace-pre-wrap ${className}`.trim()}>{bio}</p>
  );
};

export default BioText;
