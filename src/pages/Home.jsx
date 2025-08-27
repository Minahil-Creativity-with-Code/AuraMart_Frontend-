import React from 'react'
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import Cards from '../UI/Cards';
import Cards2 from '../UI/Cards2';
import Card3 from '../UI/Card3';
import Bedsheets from '../UI/Bedsheets';
import Reviews from '../UI/Reviews';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <Cards />
      <Cards2 />
      <Card3 />
      <Bedsheets />
      <Reviews />
    </Layout>
  )
}

export default Home;