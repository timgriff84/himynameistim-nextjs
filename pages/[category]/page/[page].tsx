import Head from 'next/head'
import styles from '../../../styles/listing.module.scss'

import React, { useState } from "react"
import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from "../../../layouts/layout"
import CategoryHeading from "../../../components/category-heading"
import { CategoryPagination } from "../../../components/categoryPagination"
import { Article, DisplayMode } from "../../../components/article"
import { PostModel } from "../../../Models/Post"
import { Client } from "../../../utils/prismicHelpers";
import { getCategories, getCategoryIdByUid, getCategoryPosts } from "../../../utils/queries"

const pageSize = 3;

const Category = ({page, totalPages, path, categoryName, posts} : { page: number, totalPages: number, path: string, categoryName: string, posts: Array<PostModel> }) => {
  return (
  <Layout>
  <Head>
  <title>{categoryName}</title>
  </Head>
  <CategoryHeading name={categoryName}></CategoryHeading>

    <div className={styles.listing}>
    {posts.map((post) => (
    <Article article={post} displayMode={DisplayMode.Listing}></Article>
    ))}

    <CategoryPagination page={page} totalPages={totalPages} path={path}></CategoryPagination>
    </div>
  </Layout>
  )
};

export const getStaticProps: GetStaticProps = async ({ params } : { params : { category: string, page: number} }) => {
  const category : CategoryModel = await getCategoryIdByUid(params.category);
  const posts = await getCategoryPosts(category.id, params.page, pageSize);
  return {
    props: {
      page: params.page,
      totalPages: posts?.totalPages,
      path: params.category,
      posts: posts?.posts,
      categoryName: category.name
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {   
  const categories = await getCategories();

  var routes = [];
  // add pages for category
  for (var i = 0; i < categories.length; i++) {
    var pages = Math.ceil(categories[i].postCount / pageSize);
    for (var x = 0; x < pages; x++) {
      routes.push(`/${categories[i].uid}/page/${x+1}`)
    }
  }

  return {
    paths: routes,
    fallback: false,
  }
}

export default Category;