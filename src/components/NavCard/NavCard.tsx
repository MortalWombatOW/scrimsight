import React from 'react';
import {useNavigate} from 'react-router-dom';

interface NavCardProps {
  title: string;
  image?: string;
  link: string;
}

const NavCard: React.FC<NavCardProps> = (props) => {
  const navigate = useNavigate();
  return (
    <div className="NavCard" onClick={() => navigate(props.link)}>
      {props.image && (
        <img src={props.image} alt={props.title} className="NavCard-img" />
      )}
      <div className="NavCard-content">
        <span className="NavCard-title">{props.title}</span>
        <p className="NavCard-content">{props.children}</p>
      </div>
    </div>
  );
};

export default NavCard;
