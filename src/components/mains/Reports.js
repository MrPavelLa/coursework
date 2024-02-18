import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import * as FileSaver from 'file-saver';
import '../../styles/Footer.css';
import { TextField, Button, Select, MenuItem } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';
import API from '../../api';


const Reports = () => {
  const { webtype, webcode } = useSelector((state) => state.webData);
  const userrole = useSelector((state) => state.role.userrole);
  const usercode = useSelector((state) => state.code.usercode);
  const [data, setData] = useState(null);
  const [tabledata, setTableData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [code, setCode] = useState('');
  const [ReportType, setReportType] = useState('all');

  useEffect(() => {
    if (userrole !== 'admin') {
      setCode(usercode);
    }
  }, [usercode]);

  useEffect(() => {
    fetchUserData();
  }, [code]);
  
  useEffect(() => {
    handleTable();
  }, [userData, data, ReportType]);
  
  useEffect(() => {
    fetchUserData();
    fetchAllData();
    handleTable();
  }, [ReportType]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    fetchUserData();
    handleTable();
  };


  const handleTable = () => {
    if (userData && data && ReportType) {
      if (userrole === 'user' || userData.dCapacity < 1) {
        setTableData(
          data
            .filter((item) => {
              if (ReportType === 'all') {
                return item.accessibleTo.includes(code);
              } else if (ReportType === 'webinars' && item.type === 'webinar') {

                return item.accessibleTo.includes(code);
              } else if (ReportType === 'lectures' && item.type === 'lecture') {

                return item.accessibleTo.includes(code);
              } else if (ReportType === 'trainings' && item.type === 'training') {

                return item.accessibleTo.includes(code);
              }
            })
        )
      }
      if (userrole === 'organizer' || userData.dCapacity > 0) {
        setTableData(
          data
            .filter((item) => {
              if (ReportType === 'all') {
                return item.owner.includes(code);
              } else if (ReportType === 'webinars' && item.type === 'webinar') {
                return item.owner.includes(code);
              } else if (ReportType === 'lectures' && item.type === 'lecture') {
                return item.owner.includes(code);
              } else if (ReportType === 'trainings' && item.type === 'training') {
                return item.owner.includes(code);
              }
            })
        )
      }
    }
  }

  const fetchUserData = async () => {
    const token = Cookies.get('jwt');
    try {
      const response = await API.GetUserByCode(code, token);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    };
  };

  const fetchAllData = async () => {
    const token = Cookies.get('jwt');
    try {
      const webinarsData = await API.GetAllWebinars(token);

      const lecturesData = await API.GetAllLectures(token);

      const trainingsData = await API.GetAllTrainings(token);

      const webinarsWithType = webinarsData.data.map((webinar) => ({ ...webinar, type: 'webinar' }));
      const lecturesWithType = lecturesData.data.map((lecture) => ({ ...lecture, type: 'lecture' }));
      const trainingsWithType = trainingsData.data.map((training) => ({ ...training, type: 'training' }));

      const allData = [...webinarsWithType, ...lecturesWithType, ...trainingsWithType];

      setData(allData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const exportToTxtUser = () => {
    const fileType = 'text/plain;charset=UTF-8';
    const fileExtension = '.txt';
    const titles = data.map(item => item.title);
    const maxTitleLength = Math.max(...titles.map(title => title.length));
    const headerLines = [
      new Date().toLocaleString(),
      `${userData.firstName} ${userData.lastName}`,
      `Тип${' '.repeat(12- 'Тип'.length)}|\tНазвание${' '.repeat(maxTitleLength - 'Название'.length)}|\tДата${' '.repeat(12 - 'Дата'.length)}|\tСтоимость${' '.repeat(10- 'Стоимость'.length)}|\tВыдан сертификат`,
    ];

    const txtData = headerLines.join('\n') + '\n' +
      data
        .filter((item) => {
          if (ReportType === 'all') {
            return item.accessibleTo.includes(code);
          } else if (ReportType === 'webinars' && item.type === 'webinar') {

            return item.accessibleTo.includes(code);
          } else if (ReportType === 'lectures' && item.type === 'lecture') {

            return item.accessibleTo.includes(code);
          } else if (ReportType === 'trainings' && item.type === 'training') {

            return item.accessibleTo.includes(code);
          }
        })
        .map((item) => {
          let hasCertificate = item.certificates.includes(code);

          let paddedTitle = item.title.padEnd(maxTitleLength, ' ');
          let dateValue = item.datetime ? new Date(item.datetime).toLocaleDateString() : "*";
          let paddedDate = dateValue === "*" ? `*${' '.repeat(12 - 1)}` : `${dateValue}${' '.repeat(12 - dateValue.length)}`;


          let transactionData = `${item.type}${' '.repeat(12- item.type.length)}|\t${paddedTitle}|\t${paddedDate}|\t${item.cost.toString().padEnd(10, ' ')}|\t${hasCertificate}`;

          return transactionData;
        })
        .join('\n');

    const txtBlob = new Blob([txtData], { type: fileType });
    FileSaver.saveAs(txtBlob, `transactions_${code}_${userData.lastName}${fileExtension}`);
  };

  const exportToTxtAdmin = () => {
    fetchUserData();
    if (userData.dCapacity > 0) {
      exportToTxtOrganizer();
    }
    else {
      exportToTxtUser();
    }
  };

  const exportToTxtOrganizer = () => {
    const fileType = 'text/plain;charset=UTF-8';
    const fileExtension = '.txt';

    const titles = data.map(item => item.title);
    const maxTitleLength = Math.max(...titles.map(title => title.length));

    const headerLines = [
      new Date().toLocaleString(),
      `${userData.firstName} ${userData.lastName}`,
      'Тип\t\tНазвание\t\tДата\t\tСтоимость\t\tКол-во подписок\t\tВы заработали',
    ];

    const txtData = headerLines.join('\n') + '\n' +
      data
        .filter((item) => {
          if (ReportType === 'all') {
            return item.owner.includes(code);
          } else if (ReportType === 'webinars' && item.type === 'webinar') {
            return item.owner.includes(code);
          } else if (ReportType === 'lectures' && item.type === 'lecture') {
            return item.owner.includes(code);
          } else if (ReportType === 'trainings' && item.type === 'training') {
            return item.owner.includes(code);
          }
        })
        .map((item) => {
          let AllCost = item.enrolledCount * item.cost;

          let paddedTitle = item.title.padEnd(maxTitleLength, ' ');
          let dateValue = item.datetime ? new Date(item.datetime).toLocaleDateString() : "-";
          let paddedDate = dateValue === "-" ? `-${' '.repeat(12 - 1)}` : `${dateValue}${' '.repeat(12 - dateValue.length)}`;

          let transactionData = `${item.type}\t\t${paddedTitle}\t\t${paddedDate}\t\t${item.cost}\t\t${item.enrolledCount}\t\t${AllCost}рублей`;

          return transactionData;
        })
        .join('\n');

    const txtBlob = new Blob([txtData], { type: fileType });
    FileSaver.saveAs(txtBlob, `transactions_${code}_${userData.lastName}${fileExtension}`);
  };

  const totalCost = (role) => {
    let totalCost = 0;

    if (tabledata && role === 'organizer') {
      totalCost = tabledata.reduce((sum, item) => {
        return sum + item.enrolledCount * item.cost;
      }, 0);
    }

    if (tabledata && role === 'user') {
      totalCost = tabledata.reduce((sum, item) => {
        return sum + item.cost;
      }, 0);
    }
  
    return totalCost;
  };

  return (
    <div className='Reports'>
      {(userrole === 'admin') && (
        <>
          <p>получить отчет по пользователю с кодом</p>
          <TextField
            type="text"
            placeholder="Введите код пользователя"
            value={code}
            onChange={(handleCodeChange)}
          />
          <Button onClick={() => exportToTxtAdmin()}>Сгенерировать отчет</Button>
        </>
      )}

      {(userrole === 'user' || userrole === 'organizer') && (
        <>
          <p>
            получить отчет по
            <Select
            style={{height:"30px",margin: "5px"}}
              value={ReportType}
              onChange={(e) => (setReportType(e.target.value))}
            >
              <MenuItem value="webinars">вебинарам</MenuItem>
              <MenuItem value="lectures">лекциям</MenuItem>
              <MenuItem value="trainings">тренингам</MenuItem>
              <MenuItem value="all">всем</MenuItem>
            </Select>
            <Button onClick={() => (userrole === 'user' ? exportToTxtUser() : exportToTxtOrganizer())}>
              <GetAppIcon />
            </Button>
          </p>
        </>
      )}

      {tabledata && (
        < div className='Tentative'>
          <h2>Предварительный просмотр</h2>
          <p>{userData.firstName} {userData.lastName}</p>
          <table >
            <thead>
              <tr>
                <th>Тип</th>
                <th>Название</th>
                <th>Стоимость</th>
                <th>Дата-время</th>
                {userData.dCapacity < 1 && <th>Сертификат</th>}
                {userData.dCapacity > 0 && (
                  <>
                    <th>Записалось человек</th>
                    <th>Получили с мероприятия</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {tabledata.map((item, index) => (
                <tr key={index}>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>{item.cost}</td>
                  <td>{item.datetime ? new Date(item.datetime).toLocaleDateString() : "*"}</td>
                  {userData.dCapacity < 1 && <td>{item.certificates.includes(code) ? 'Выдан' : 'Не выдан'}</td>}
                  {userData.dCapacity > 0 && (
                    <>
                      <td>{item.enrolledCount}</td>
                      <td>{item.enrolledCount * item.cost}р</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {userData.dCapacity > 1 ?
            <p>Заработано за все время: {totalCost('organizer')}р</p>
            :
            <p>Потрачено за все время: {totalCost('user')}р</p>
          }
        </div>
      )}
    </div>
  );
};

export default Reports;
