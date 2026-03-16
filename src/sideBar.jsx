import React from "react";

function Sidebar({ showEdges, setShowEdges, showVertices, setShowVertices,applyGravity, 
  handleGravityToggle }) {

  return (
    <div style={{
      width: "200px",
      background: "#222",
      color: "white",
      padding: "15px",
      height: "95vh"
    }}>

      <h3>You Can:</h3>

      <label>
        <input
          type="checkbox"
          checked={showEdges}
          onChange={(e) => setShowEdges(e.target.checked)}
        />
        Highlight Cube Edges
      </label>

      <br/><br/>

      <label>
        <input
          type="checkbox"
          checked={showVertices}
          onChange={(e) => setShowVertices(e.target.checked)}
        />
        Highlight Cube Vertices
      </label>

      <br/><br/>

      <label>
        <input
          type="checkbox"
          checked={applyGravity}
          onChange={(e) => handleGravityToggle(e.target.checked)}
        />
        Apply Gravity to Box
      </label>

    </div>
  );
}

export default Sidebar;