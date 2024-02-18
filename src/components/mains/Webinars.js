import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { saveWebData } from '../../store/actions/action4';
import Modal from './WLTmodel';

const Webinars = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(saveWebData('webinar', null));
    };

    fetchData();
  }, []);

  return (
    <Modal/>
  );
};

export default Webinars;
