import "./Spinner.css";

const Spinner = ({ uploadStatus }) => {
  const el = (
    <div className="spinner-center">
      {uploadStatus && (
        <>
          <div className="spinner-upload-text">Uploading...</div>
          <div className="spinner-upload">{uploadStatus} %</div>
        </>
      )}
      <div className="spinner-ind">
        <div className="spinner-ind-chase-dot"></div>
        <div className="spinner-ind-chase-dot"></div>
        <div className="spinner-ind-chase-dot"></div>
        <div className="spinner-ind-chase-dot"></div>
        <div className="spinner-ind-chase-dot"></div>
        <div className="spinner-ind-chase-dot"></div>
      </div>
    </div>
  );

  return el;
};

export default Spinner;
