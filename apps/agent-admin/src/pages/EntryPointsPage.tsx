import PageContainer from '../components/AgentManagement/PageContainer';

const EntryPointsPage = () => {
  const subHeading =
    'Hover over any editable area in the entry point to customize it. Just click and start typing — your changes will be saved automatically.';

  return <PageContainer heading={'EntryPoints'} subHeading={subHeading}></PageContainer>;
};

export default EntryPointsPage;
